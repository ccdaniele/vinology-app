class Car < ApplicationRecord
  belongs_to :query

  validates :vin_number, presence: true
  validates :query, presence: true
end
