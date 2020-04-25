class CreateCourses < ActiveRecord::Migration[6.0]
  def change
    create_table :courses do |t|
      t.string :name
      t.string :philosophy
      t.string :axis
      t.string :profile
      t.string :information
      t.boolean :status, default: true
      t.references :academic_period, null: false, foreign_key: true

      t.timestamps
    end
  end
end
