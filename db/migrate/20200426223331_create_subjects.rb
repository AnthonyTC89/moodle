class CreateSubjects < ActiveRecord::Migration[6.0]
  def change
    create_table :subjects do |t|
      t.string :name
      t.string :description
      t.string :information
      t.boolean :status, default: true
      t.references :course, null: false, foreign_key: true

      t.timestamps
    end
  end
end
