class Query < ApplicationRecord
  belongs_to :user
  has_many :cars, dependent: :destroy

  validates :name, presence: true
end
