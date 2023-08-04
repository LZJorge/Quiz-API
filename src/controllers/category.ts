/**
 * Category Controller
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */
import { Request, Response } from 'express'
import Category from '../models/Category'

class CategoryController {

    /**
     * Get all categories
     * @url '/category/get'
     * @method GET
     */
    public static async getCategories(req: Request, res: Response): Promise<void> {
        try {
            const categories = await Category.findAll({
                attributes: ['id', 'name', 'imgUrl', 'slug']
            })

            res.status(200).json(categories)
        } catch(error) {
            res.status(500).json({
                code: 'error',
                message: 'Ocurrió un error al obtener las categorias'
            })
        }
    }
}

export default CategoryController