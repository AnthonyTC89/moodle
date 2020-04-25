require "rails_helper"

RSpec.describe AcademicPeriodsController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(:get => "/academic_periods").to route_to("academic_periods#index")
    end

    it "routes to #show" do
      expect(:get => "/academic_periods/1").to route_to("academic_periods#show", :id => "1")
    end


    it "routes to #create" do
      expect(:post => "/academic_periods").to route_to("academic_periods#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/academic_periods/1").to route_to("academic_periods#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/academic_periods/1").to route_to("academic_periods#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/academic_periods/1").to route_to("academic_periods#destroy", :id => "1")
    end
  end
end
