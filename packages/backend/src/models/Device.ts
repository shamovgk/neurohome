import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';

interface DeviceAttributes {
  id: string;
  userId: string;
  name: string;
  type: string;
  status: 'online' | 'offline';
  location?: string;
  lastSeen: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DeviceCreationAttributes extends Optional<DeviceAttributes, 'id' | 'lastSeen'> {}

class Device extends Model<DeviceAttributes, DeviceCreationAttributes> implements DeviceAttributes {
  public id!: string;
  public userId!: string;
  public name!: string;
  public type!: string;
  public status!: 'online' | 'offline';
  public location?: string;
  public lastSeen!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Device.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'plant',
    },
    status: {
      type: DataTypes.ENUM('online', 'offline'),
      defaultValue: 'offline',
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    lastSeen: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'devices',
    timestamps: true,
  }
);

export default Device;
