/**
 * User Model
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import { Model, DataTypes, InferAttributes } from 'sequelize'
import sequelize from '../config/db'
import bcrypt from 'bcrypt'
import { IUser } from '../definitions'

class User extends Model {
	public id!: string
	public username!: string
	public profileImgUrl!: string
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

	profileImgUrl: {
		type: DataTypes.STRING,
		defaultValue: '/avatars/041-man.svg'
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
		beforeSave: (user) => {
			user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10))
		}
	}
})

User.prototype.verifyPassword = async function(password) {
    return bcrypt.compareSync(password, this.password)
}

export default User