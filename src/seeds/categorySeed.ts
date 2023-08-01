import Category from '../models/Category'

export const categories: string[] = [
    'Deportes',
    'Programación'
]

export async function loadData(): Promise<void> {
    categories.forEach( async (category) => {
        try {
            await Category.create({
                name: category
            })
        } catch(error) {
            console.log(error)
        }
    })
}