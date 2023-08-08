import Category from '../models/Category'
import { normalizeString } from '../helpers/normalizeHelper'

export const categories: string[] = [
    'Deportes',
    'Arte',
    'Historia',
    'Música',
    'Programación'
]

export async function loadCategoryData(): Promise<void> {
    categories.forEach( async (category) => {
        try {
            category = category.trim()

            const categorySlug = normalizeString(category)

            const categoryUrl = `/categories/${categorySlug}.svg`

            await Category.create({
                name: category,
                imgUrl: categoryUrl,
                slug: categorySlug
            })
        } catch(error) {
            console.log(error)
        }
    })
}
