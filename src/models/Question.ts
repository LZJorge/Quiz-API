/**
 * Question Model
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db'
import { loadData } from '../seeds/questionSeed'
import { difficulty } from '../definitions'

class Question extends Model {
    public id!: number
    public question!: string
    public correctAnswer!: string
    public options!: string[]
    public points!: number
    public difficulty!: difficulty
    
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

Question.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },

    question: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    correctAnswer: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    options: {
        type: DataTypes.JSON,
        allowNull: false,
    },

    points: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    difficulty: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    createdAt: DataTypes.DATE,
	updatedAt: DataTypes.DATE,
}, {
    tableName: 'questions',
    sequelize,
    hooks: {
        afterSync: async () => {
            const count = await Question.count()
            if (count === 0) { 
                loadData()
            }
        }
    }
})

export default Question