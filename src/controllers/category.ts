/**
 * Category Controller
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */
import { Request, Response } from 'express'
import CategoryService from '../services/categoryService'
import { RESPONSE_CODE } from '../definitions'

class CategoryController {

    /**
     * Get all categories
     * @url '/category/get'
     * @method GET
     */
    public static async getCategories(req: Request, res: Response): Promise<void> {
        try {
            const categories = await CategoryService.getAllCategories()

            res.status(200).json({
                code: RESPONSE_CODE.SUCCESS,
                categories
            })
        } catch(error) {
            res.status(500).json({
                code: RESPONSE_CODE.ERROR,
                message: 'Ocurrió un error al obtener las categorias'
            })
        }
    }
}

export default CategoryController