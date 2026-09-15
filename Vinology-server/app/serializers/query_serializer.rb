# frozen_string_literal: true

class QuerySerializer
  def initialize(query)
    @query = query
  end

  def as_json(*)
    {
      id: @query.id,
      name: @query.name,
      user_id: @query.user_id,
      cars: Array(@query.cars).map { |car| CarSerializer.new(car).as_json }
    }
  end
end
