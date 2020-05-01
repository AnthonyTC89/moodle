class CreateSchedules < ActiveRecord::Migration[6.0]
  def change
    create_table :schedules do |t|
      t.string :weekday
      t.time :time
      t.string :location
      t.boolean :status, default: true
      t.references :course, null: false, foreign_key: true

      t.timestamps
    end
  end
end
