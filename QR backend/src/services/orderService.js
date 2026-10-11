require("dotenv").config();

const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// =====================================================
// CREATE ORDER
// =====================================================

const createOrder = async ({
  guestId,
  restaurantId,
  tableNumber,
  customerName,
  customerPhone,
  customerEmail,
  paymentMethod,
  specialInstructions,
}) => {
  // 1. Guest ka cart find karo
  const cart = await prisma.cart.findUnique({
    where: {
      guestId,
    },
    include: {
      items: {
        include: {
          food: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // 2. Restaurant check
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  // 3. Check all food items belong to same restaurant
  for (const item of cart.items) {
    if (item.food.restaurantId !== restaurantId) {
      throw new Error(
        "Cart contains food from another restaurant"
      );
    }

    if (!item.food.available) {
      throw new Error(
        `${item.food.name} is currently unavailable`
      );
    }
  }

  let subtotal = 0;
  console.log(
  "ORDER PRICING DEBUG:",
  cart.items.map(item => ({
    food: item.food.name,
    price: item.food.price,
    quantity: item.quantity,
  }))
);

const prepTimes = cart.items.map(
  (item) => Number(item.food.prepTime) || 0
);

for (const item of cart.items) {
  subtotal +=
    Number(item.food.price) * item.quantity;
}

const estimatedPrepTime = Math.ceil(
  prepTimes.reduce(
    (sum, time) => sum + time,
    0
  ) / prepTimes.length
);

  // 5. Tax
  const tax = Number(
    (subtotal * 0.05).toFixed(2)
  );

  const discount = 0;

  const total = Number(
    (subtotal + tax - discount).toFixed(2)
  );

  // 6. Create Order + Items + Status History
  const order = await prisma.$transaction(
    async (tx) => {
      // ---------------------------------------------
      // Generate customer-friendly order token
      // ---------------------------------------------

      const tokenResult = await tx.order.aggregate({
        _max: {
          tokenNumber: true,
        },
      });

      const nextTokenNumber =
        (tokenResult._max.tokenNumber || 0) + 1;

      // ---------------------------------------------
      // Create Order
      // ---------------------------------------------

      const newOrder = await tx.order.create({
        data: {
          // Internal UUID
          id: crypto.randomUUID(),

          // Customer-facing token
          tokenNumber: nextTokenNumber,

          restaurantId,
          guestId,

          tableNumber,

          customerName,
          customerPhone,
          customerEmail,

          subtotal,
          tax,
          discount,
          total,

          paymentMethod,
          paymentStatus: "PENDING",
          status: "RECEIVED",

          specialInstructions,
          estimatedPrepTime,

          // -----------------------------------------
          // Order Items
          // -----------------------------------------

          items: {
            create: cart.items.map((item) => ({
              id: crypto.randomUUID(),

              foodId: item.food.id,
              name: item.food.name,
              price: item.food.price,
              quantity: item.quantity,
              image: item.food.image,
              category: item.food.categoryId,
            })),
          },

          // -----------------------------------------
          // Status History
          // -----------------------------------------

          statusHistory: {
            create: {
              id: crypto.randomUUID(),
              status: "RECEIVED",
            },
          },
        },

        include: {
          items: true,
          statusHistory: true,
          restaurant: true,
        },
      });

      // ---------------------------------------------
      // Cart empty
      // ---------------------------------------------

      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return newOrder;
    },
    {
      timeout: 15000,
      maxWait: 10000,
    }
  );

  return order;
};

// =====================================================
// GET GUEST ORDERS
// =====================================================

const getOrdersByGuest = async (guestId) => {
  return await prisma.order.findMany({
    where: {
      guestId,
    },

    include: {
      items: true,
      restaurant: true,
      statusHistory: true,
      payment: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

// =====================================================
// GET SINGLE GUEST ORDER
// =====================================================

const getOrderById = async (id, guestId) => {
  const order = await prisma.order.findFirst({
    where: {
      id,
      guestId,
    },

    include: {
      items: true,
      restaurant: true,
      statusHistory: true,
      payment: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

// =====================================================
// UPDATE ORDER STATUS
// =====================================================

const updateOrderStatus = async (
  orderId,
  status
) => {
  const allowedStatuses = [
    "RECEIVED",
    "PREPARING",
    "READY",
    "COMPLETED",
    "CANCELLED",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid order status");
  }

  const existingOrder =
    await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

  if (!existingOrder) {
    throw new Error("Order not found");
  }

  const updatedOrder =
    await prisma.$transaction(
      async (tx) => {
        // 1. Update order status
        await tx.order.update({
          where: {
            id: orderId,
          },

          data: {
            status,
          },
        });

        // 2. Create status history
        await tx.orderStatusHistory.create({
          data: {
            id: crypto.randomUUID(),
            orderId,
            status,
          },
        });

        // 3. Fresh order fetch
        return await tx.order.findUnique({
          where: {
            id: orderId,
          },

          include: {
            items: true,
            restaurant: true,
            statusHistory: true,
            payment: true,
          },
        });
      },
      {
        timeout: 15000,
        maxWait: 10000,
      }
    );

  return updatedOrder;
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createOrder,
  getOrdersByGuest,
  getOrderById,
  updateOrderStatus,
};