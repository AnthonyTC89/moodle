class CreateAcademicPeriods < ActiveRecord::Migration[6.0]
  def change
    create_table :academic_periods do |t|
      t.integer :year
      t.integer :period
      t.string :information
      t.boolean :status, default: true

      t.timestamps
    end
  end
end
