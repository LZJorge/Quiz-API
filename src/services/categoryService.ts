import Category from '../models/Category'
import { ICategory } from '../definitions'

class CategoryService {

    /**
     * @description
     * 
     * Get all questions categories
     */
    public async getAllCategories(): Promise<ICategory[] | null> {
        try {
            const categories = await Category.findAll({
                attributes: ['id', 'name', 'imgUrl', 'slug']
            })
    
            if(!categories) {
                throw new Error('Ha ocurrido un error al obtener las categorias')
            }

            return categories
        } catch(error) {
            return null
        }
    }
}

export default new CategoryService()