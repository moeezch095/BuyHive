import { success } from "zod";
import {
  fetchProducts,
  getAllCategories,
  getCategoryByIdService,
  getProductById,
} from "../services/category.service.js";

export const getAllCategoriesController = async (req, res) => {
  try {
    const data = await getAllCategories();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCategoryByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await getCategoryByIdService(Number(id));

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const filters = req.query;
    const products = await fetchProducts(filters);
    res.status(200).json({
      succes: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "product id is required",
      });
    }
    const product = await getProductById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    }
    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// import { success } from "zod";
// import { getCategoryWithChildren } from "../services/category.service";

// export const getAllCategories = async(req, res) => {
//   try{
//     const data = await getCategoriesThreeLevels();
//     res.json({ success: true, data });
//   } catch(error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// export const getCategoryById = async(req,res) => {
//   try {
//     const {id } = req.params;
//     const data = await getCategoryWithChildren(Number(id));

//     res.json({
//       success: true,
//       data
//     });
//   } catch(error) {
//     res.status(404).json({
//       success: false,
//       message: error.message
//     });
//   }
// };
