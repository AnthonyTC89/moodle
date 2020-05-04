module Api
  class DocumentsController < ApplicationController
    before_action :set_document, only: [:show, :update, :destroy]

    # GET /documents
    # def index
    #   @documents = Document.all

    #   render json: @documents
    # end

    # GET /documents_full
    def index_full
      @query = 'SELECT d.id, d.location, d.key, d.status, d.subject_id'
      @query << ' FROM documents as d INNER JOIN subjects as s ON d.subject_id = s.id'
      @query << " WHERE d.subject_id=#{params[:subject_id].to_i}"
      @query << ' AND d.status=true' if params[:session_status].to_i >= 4
      @query << ' ORDER BY d.created_at'
      @documents = Document.connection.select_all(@query).to_a
      render json: @documents
    end

    # GET /documents/1
    # def show
    #   render json: @document
    # end

    # POST /documents
    def create
      @document = Document.new(document_params)

      if @document.save
        render json: @document, status: :created
      else
        render json: @document.errors, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /documents/1
    def update
      if @document.update(document_params)
        render json: @document
      else
        render json: @document.errors, status: :unprocessable_entity
      end
    end

    # DELETE /documents/1
    def destroy
      @document.destroy
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_document
        @document = Document.find(params[:id])
      end

      # Only allow a trusted parameter "white list" through.
      def document_params
        params.require(:document).permit(:location, :key, :bucket, :status, :subject_id, :session_status)
      end
  end
end