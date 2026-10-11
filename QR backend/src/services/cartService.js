require("dotenv").config();

const crypto = require("crypto");

const {
  PrismaClient,
} = require("@prisma/client");

const {
  PrismaPg,
} = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// ============================================
// GET OR CREATE GUEST CART
// ============================================

const getOrCreateCart = async (guestId) => {
  let cart = await prisma.cart.findUnique({
    where: {
      guestId,
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        id: crypto.randomUUID(),
        guestId,
      },
    });
  }

  return cart;
};

// ============================================
// GET CART
// ============================================

const getCart = async (guestId) => {
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

  if (!cart) {
    return null;
  }

  return cart;
};

// ============================================
// ADD TO CART
// ============================================

const addToCart = async (
  guestId,
  foodId,
  quantity = 1
) => {
  const food =
    await prisma.foodItem.findUnique({
      where: {
        id: foodId,
      },
    });

  if (!food) {
    throw new Error(
      "Food item not found"
    );
  }

  if (!food.available) {
    throw new Error(
      "Food item is not available"
    );
  }

  if (quantity < 1) {
    throw new Error(
      "Quantity must be at least 1"
    );
  }

  const cart =
    await getOrCreateCart(guestId);

  const existingItem =
    await prisma.cartItem.findUnique({
      where: {
        cartId_foodId: {
          cartId: cart.id,
          foodId,
        },
      },
    });

  let cartItem;

  if (existingItem) {
    cartItem =
      await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },

        data: {
          quantity:
            existingItem.quantity +
            quantity,
        },

        include: {
          food: true,
        },
      });
  } else {
    cartItem =
      await prisma.cartItem.create({
        data: {
          id: crypto.randomUUID(),
          cartId: cart.id,
          foodId,
          quantity,
        },

        include: {
          food: true,
        },
      });
  }

  return cartItem;
};

// ============================================
// UPDATE CART ITEM
// ============================================

const updateCartItem = async (
  guestId,
  itemId,
  quantity
) => {
  if (quantity < 1) {
    throw new Error(
      "Quantity must be at least 1"
    );
  }

  const cart =
    await prisma.cart.findUnique({
      where: {
        guestId,
      },
    });

  if (!cart) {
    throw new Error(
      "Cart not found"
    );
  }

  const cartItem =
    await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

  if (!cartItem) {
    throw new Error(
      "Cart item not found"
    );
  }

  return await prisma.cartItem.update({
    where: {
      id: itemId,
    },

    data: {
      quantity,
    },

    include: {
      food: true,
    },
  });
};

// ============================================
// REMOVE CART ITEM
// ============================================

const removeCartItem = async (
  guestId,
  itemId
) => {
  const cart =
    await prisma.cart.findUnique({
      where: {
        guestId,
      },
    });

  if (!cart) {
    throw new Error(
      "Cart not found"
    );
  }

  const cartItem =
    await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

  if (!cartItem) {
    throw new Error(
      "Cart item not found"
    );
  }

  await prisma.cartItem.delete({
    where: {
      id: itemId,
    },
  });

  return {
    id: itemId,
  };
};

// ============================================
// CLEAR CART
// ============================================

const clearCart = async (guestId) => {
  const cart =
    await prisma.cart.findUnique({
      where: {
        guestId,
      },
    });

  if (!cart) {
    throw new Error(
      "Cart not found"
    );
  }

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });

  return {
    cartId: cart.id,
  };
};

module.exports = {
  getOrCreateCart,
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};  