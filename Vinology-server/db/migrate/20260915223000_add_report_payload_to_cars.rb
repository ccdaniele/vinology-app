class AddReportPayloadToCars < ActiveRecord::Migration[7.2]
  def change
    add_column :cars, :report_payload, :jsonb, default: {}, null: false
  end
end
