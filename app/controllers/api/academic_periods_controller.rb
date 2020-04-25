module Api
  class AcademicPeriodsController < ApplicationController
    before_action :set_academic_period, only: [:show, :update, :destroy]

    # GET /academic_periods
    def index
      @academic_periods = AcademicPeriod.all

      render json: @academic_periods
    end

    # GET /academic_periods/active
    def index_active
      @academic_periods = AcademicPeriod.where(status: true)

      render json: @academic_periods
    end

    # GET /academic_periods/1
    def show
      render json: @academic_period
    end

    # POST /academic_periods
    def create
      @academic_period = AcademicPeriod.new(academic_period_params)

      if @academic_period.save
        render json: @academic_period, status: :created
      else
        render json: @academic_period.errors, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /academic_periods/1
    def update
      if @academic_period.update(academic_period_params)
        render json: @academic_period
      else
        render json: @academic_period.errors, status: :unprocessable_entity
      end
    end

    # DELETE /academic_periods/1
    def destroy
      @academic_period.destroy
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_academic_period
        @academic_period = AcademicPeriod.find(params[:id])
      end

      # Only allow a trusted parameter "white list" through.
      def academic_period_params
        params.require(:academic_period).permit(:year, :period, :information, :status)
      end
  end
end