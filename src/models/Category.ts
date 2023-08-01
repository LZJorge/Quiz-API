import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db'
import { loadData } from '../seeds/categorySeed'

class Category extends Model {
    public id!: number
    public name!: string

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

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    tableName: 'categories',
    sequelize,
    hooks: {
        afterSync: async () => {
            const count = await Category.count()
            if(count === 0) {
                await loadData()
            }
        }
    }
})

export default Category