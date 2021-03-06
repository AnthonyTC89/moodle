module Api
  class UsersController < ApplicationController
    before_action :set_user, only: [:show, :update, :destroy]

    # GET /users
    def index
      @users = User.all

      render json: @users
    end

    # POST /user/login
    def login
      @user = User.find_by(username: params[:username])
      if @user 
        if @user.authenticate(params[:password_digest])
          render json: @user, status: :accepted
        else
          render json: @user.errors, status: :unauthorized
        end
      else
        render json: @user, status: :not_found
      end
    end

    # GET /users/1
    def show
      render json: @user
    end

    # POST /users
    def create
      @user = User.new(user_params)

      if @user.save
        render json: @user, status: :created
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /users/1
    def update
      if @user.update(user_params)
        render json: @user
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    end

    # DELETE /users/1
    def destroy
      @user.destroy
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_user
        @user = User.find(params[:id])
      end

      # Only allow a trusted parameter "white list" through.
      def user_params
        params.require(:user).permit(:username, :email, :password_digest, :status, :type_doc, :num_doc, :abrev, :nickname, :lastname1, :lastname2, :mobile, :address, :information, :degree, :biography)
      end
  end
end