class User < ApplicationRecord
  has_secure_password
  has_many :queries, dependent: :destroy
  has_many :cars, through: :queries

  validates :username, presence: true, uniqueness: { case_sensitive: false }
  validates :email, presence: true
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }
end
