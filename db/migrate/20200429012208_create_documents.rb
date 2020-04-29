class CreateDocuments < ActiveRecord::Migration[6.0]
  def change
    create_table :documents do |t|
      t.string :location
      t.string :key
      t.string :bucket
      t.boolean :status, default: true
      t.references :subject, null: false, foreign_key: true

      t.timestamps
    end
  end
end
