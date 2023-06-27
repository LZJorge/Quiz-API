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
	public password!: string
	public score!: number
	public actualQuestion!: number

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

	actualQuestion: {
		type: DataTypes.INTEGER,
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