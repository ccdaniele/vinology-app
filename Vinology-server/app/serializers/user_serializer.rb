class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :username, :email
  has_many :queries
  has_many :cars, through: :queries
end
