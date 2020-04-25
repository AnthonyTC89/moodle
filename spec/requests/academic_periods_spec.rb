require 'rails_helper'

RSpec.describe "AcademicPeriods", type: :request do
  describe "GET /academic_periods" do
    it "works! (now write some real specs)" do
      get academic_periods_path
      expect(response).to have_http_status(200)
    end
  end
end
