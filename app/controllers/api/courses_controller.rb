module Api
  class CoursesController < ApplicationController
    before_action :set_course, only: [:show, :update, :destroy]

    # GET /courses
    def index
      @courses = Course.all

      render json: @courses
    end

    # GET /courses/full
    def full_index
      @user = User.find_by(id: params[:user_id])
      @query = 'SELECT c.id, c.name, c.philosophy, c.axis, c.profile, c.information, c.status, c.academic_period_id, c.user_id, ap.year, ap.period'
      @query << ' FROM courses as c'
      @query << ' INNER JOIN academic_periods as ap ON c.academic_period_id = ap.id'
      @query << ' WHERE true'
      @query << " AND c.user_id=#{params[:user_id]}" if @user.status === 3
      @query << " AND c.status=true" if @user.status === 4
      @query << ' ORDER BY c.created_at'
      @courses = Course.connection.select_all(@query).to_a
      render json: @courses
    end

    # GET /courses/1
    def show
      render json: @course
    end

    # POST /courses
    def create
      @course = Course.new(course_params)

      if @course.save
        render json: @course, status: :created
      else
        render json: @course.errors, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /courses/1
    def update
      if @course.update(course_params)
        render json: @course
      else
        render json: @course.errors, status: :unprocessable_entity
      end
    end

    # DELETE /courses/1
    def destroy
      @course.destroy
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_course
        @course = Course.find(params[:id])
      end

      # Only allow a trusted parameter "white list" through.
      def course_params
        params.require(:course).permit(:name, :philosophy, :axis, :profile, :information, :status, :academic_period_id, :user_id)
      end
  end
end