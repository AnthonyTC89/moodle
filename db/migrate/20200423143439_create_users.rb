class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :username
      t.string :email
      t.string :password_digest
      t.string :type_doc
      t.string :num_doc
      t.string :abrev
      t.string :nickname
      t.string :lastname1
      t.string :lastname2
      t.string :mobile
      t.string :address
      t.string :information
      t.string :degree
      t.string :biography
      t.integer :status, default: 4

      t.timestamps
    end
  end
end
