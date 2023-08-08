import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db'
import { loadCategoryData } from '../seeds/categorySeed'

class Category extends Model {
    public id!: number
    public name!: string
    public imgUrl!: string
    public slug!: string

    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

Category.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
    },

    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },

    imgUrl: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },

    slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    tableName: 'categories',
    sequelize,
    hooks: {
        afterSync: async () => {
            const count = await Category.count()
            if(count === 0) {
                await loadCategoryData()
            }
        }
    }
})

export default Category