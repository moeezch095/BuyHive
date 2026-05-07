import prisma from "../config/prismaClient.js";

export const getAllCategories = async () => {
  console.log("code reached in category");
  const categories = await prisma.category.findMany({
    include: {
      sub_categories: {
        where: { parent_id: null },
        include: {
          children: true,
        },
      },
    },
  });
  console.log("code category");
  return categories;
};

export const getCategoryByIdService = async (categoryId) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      sub_categories: {
        where: { parent_id: null },
        include: {
          children: true,
        },
      },
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

export const fetchProducts = async (filters) => {
  const {
    category_id,
    sub_category_id,
    price_min,
    price_max,
    certifications,
    country,
    search,
    page = 1,
    limit = 10,
  } = filters;

  let whereClause = {};

  if (category_id) {
    whereClause.sub_category = {
      category_id: Number(category_id),
    };
  }

  if (sub_category_id) {
    whereClause.sub_category_id = Number(sub_category_id);
  }

  if (price_min || price_max) {
    whereClause.price = {};

    if (price_min) {
      whereClause.price.gte = Number(price_min);
    }
    if (price_max) {
      whereClause.price.lte = Number(price_max);
    }
  }

  if (certifications) {
    const certArray = certifications.split(",");

    whereClause.AND = certArray.map((cert) => ({
      certifications: {
        contains: cert,
        mode: "insensitive",
      },
    }));
  }

  if (country) {
    whereClause.source_country = {
      equals: country,
      mode: "insensitive",
    };
  }

  if (search) {
    whereClause.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        brand: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);
  const total = await prisma.product.count({
    where: whereClause,
  });
  const products = await prisma.product.findMany({
    where: whereClause,

    include: {
      sub_category: true,
    },
    orderBy: {
      price: "asc",
    },
    skip,
    take,
  });

  return {
    data: products,
    pagination: {
      total,
      page: 2,
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      sub_category: true,
      user: true,
    },
  });
  return product;
};

// import prisma from "../config/prismaClient";

//   const getCategoriesThreeLevels = async() => {
//     const categories =  await prisma.category.findMany();
//     const mainCategories = categories.filter(cat => cat.parentId === null);
//     const result = mainCategories.map(main => {
//       const subCategories = categories
//       .filter(cat => cat.parentId  === main.id)
//       .map(sub => {
//         const subSubCategories = categories
//         .filter(cat => cat.parentId === sub.id

//         );

//         return {
//           id: sub.id,
//           name: sub.name,
//           parentId: sub.parentId,
//           subCategories: subSubCategories
//         };
//       });

//       return {
//         id: main.id,
//         name: main.name,
//         parentId: main.parentId,
//         subCategories

//       };
//     });

//     return result;
//   };

//   export const getCategoryWithChildren = async(categoryId) => {
//     const categories = await prisma.category.findMany();
//     const main = categories.find(cat => cat.id === categoryId);
//     if(!main || main.parentId !== null) {
//       throw new error("Main category not found ");
//     }
//     const subCategories = categories
//     .filter(cat => cat.parentId === main.id)
//     .map(sub => {
//       const subSubCategories = categories
//       .filter(cat=> cat.parentId === sub.id);
//       return{
//         id: sub.id,
//         name: sub.name,
//         subCategories: subSubCategories
//       };
//     });
//     return {
//       id: main.id,
//       name: main.name,
//       subCategories
//     };
//   };
