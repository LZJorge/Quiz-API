/**
 * User Model
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db'
import bcrypt from 'bcrypt'

class User extends Model {
	public id!: string
	public username!: string
	public avatar!: string
	public password!: string
	public score!: number
	public activeQuestion!: number
	public totalQuestions!: number
	public successResponses!: number

	declare public verifyPassword: (password: string) => Promise<boolean>

	public readonly createdAt!: Date
	public readonly updatedAt!: Date
}

User.init({
	id: {
		type: DataTypes.UUIDV4,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
		allowNull: false,
		unique: true,
		validate: {
			isUUID: 4
		}
	},

	username: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		validate: {
			min: 3
		}
	},

	avatar: {
		type: DataTypes.STRING,
		defaultValue: 'avatars/avatar-38.svg'
	},

	password: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			min: 8
		}
	},

	score: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},

	activeQuestion: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},

	totalQuestions: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 0,
	},
	
	successResponses: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 0,
	},

	createdAt: DataTypes.DATE,
	updatedAt: DataTypes.DATE,
}, {
	tableName: 'users',
	sequelize,
	hooks: {
		beforeSave: async (user) => {
			if(user.changed('password')) {
				user.password = await bcrypt.hash(user.password, 10)
			}
		}
	}
})

User.prototype.verifyPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

export default User