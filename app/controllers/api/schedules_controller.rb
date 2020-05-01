module Api
  class SchedulesController < ApplicationController
    before_action :set_schedule, only: [:show, :update, :destroy]

    # GET /schedules
    def index
      @schedules = Schedule.all

      render json: @schedules
    end

    # GET /schedules_full
    def index_full
      @query = 'SELECT sc.id, sc.weekday, sc.time, sc.location, sc.status, sc.course_id'
      @query << ' FROM schedules as sc INNER JOIN courses as c ON sc.course_id = c.id'
      @query << " WHERE sc.course_id=#{params[:course_id]}"
      @query << ' AND sc.status=true' if params[:session_status] === 4
      @query << ' ORDER BY sc.created_at'
      @schedules = Schedule.connection.select_all(@query).to_a
      render json: @schedules
    end

    # GET /schedules/1
    # def show
    #   render json: @schedule
    # end

    # POST /schedules
    def create
      @schedule = Schedule.new(schedule_params)

      if @schedule.save
        render json: @schedule, status: :created
      else
        p "errors: #{@schedule.errors}"
        p "errors: #{@schedule.errors.full_messages}"
        render json: @schedule.errors, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /schedules/1
    def update
      if @schedule.update(schedule_params)
        render json: @schedule
      else
        render json: @schedule.errors, status: :unprocessable_entity
      end
    end

    # DELETE /schedules/1
    def destroy
      @schedule.destroy
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_schedule
        @schedule = Schedule.find(params[:id])
      end

      # Only allow a trusted parameter "white list" through.
      def schedule_params
        params.require(:schedule).permit(:weekday, :time, :location, :status, :course_id, :session_status)
      end
  end
end