class Api::V1::QueriesController < ApplicationController
  before_action :set_query, only: [:update, :destroy]

  def index
    queries = current_user.queries.includes(:cars)
    render json: queries.map { |query| QuerySerializer.new(query) }
  end

  def create
    query = current_user.queries.build(name: query_params[:name])

    if query.save
      render json: QuerySerializer.new(query), status: :created
    else
      render json: { error: query.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @query.update(name: query_params[:name])
      render json: QuerySerializer.new(@query), status: :ok
    else
      render json: { error: @query.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @query.destroy
    head :no_content
  end

  private

  def set_query
    @query = current_user.queries.find_by(id: params[:id])
    return if @query

    render json: { error: 'Query not found' }, status: :not_found
  end

  def query_params
    params.require(:query).permit(:name)
  end
end
