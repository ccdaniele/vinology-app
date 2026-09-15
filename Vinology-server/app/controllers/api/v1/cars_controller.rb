class Api::V1::CarsController < ApplicationController
  before_action :set_car, only: [:show, :destroy]

  def index
    cars = Car.joins(:query).where(queries: { user_id: current_user.id })
    render json: cars.map { |car| CarSerializer.new(car) }
  end

  def show
    render json: CarSerializer.new(@car)
  end

  def create
    query = current_user.queries.find_by(id: car_params[:query_id])
    unless query
      return render json: { error: 'Query not found' }, status: :not_found
    end

    car = query.cars.build(car_params.except(:query_id))

    if car.save
      render json: CarSerializer.new(car), status: :created
    else
      render json: { error: car.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @car.destroy
    head :no_content
  end

  private

  def set_car
    @car = Car.joins(:query).where(queries: { user_id: current_user.id }).find_by(id: params[:id])
    return if @car

    render json: { error: 'Car not found' }, status: :not_found
  end

  def car_params
    permitted = params.require(:car).permit(
      :query_id,
      :vin_number,
      :model,
      :make,
      :year,
      :highway_mileage,
      :transmission,
      :city_mileage,
      :trim_level,
      :anti_brake_system,
      :drive_type,
      :engine,
      :standard_seating,
      :tank_size,
      :TitleIssuingAuthorityName,
      :VehicleOdometerReadingMeasure,
      :historyInformationlength,
      :brandsRecordCount,
      :adjustedCleanRetail,
      :adjustedAverageTrade,
      :averageMileage,
      :maxMileageAdj
    )

    raw_payload = params[:car][:report_payload]
    if raw_payload.present?
      permitted[:report_payload] =
        if raw_payload.respond_to?(:to_unsafe_h)
          raw_payload.to_unsafe_h
        elsif raw_payload.respond_to?(:to_h)
          raw_payload.to_h
        else
          raw_payload
        end
    end

    permitted
  end
end
