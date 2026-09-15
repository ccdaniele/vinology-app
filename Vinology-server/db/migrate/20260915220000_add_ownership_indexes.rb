class AddOwnershipIndexes < ActiveRecord::Migration[7.2]
  def change
    add_index :users, :username, unique: true
    add_index :queries, :user_id
    add_index :cars, :query_id
    add_index :cars, :vin_number
  end
end
