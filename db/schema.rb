# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_04_29_012208) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "academic_periods", force: :cascade do |t|
    t.integer "year"
    t.integer "period"
    t.string "information"
    t.boolean "status", default: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "courses", force: :cascade do |t|
    t.string "name"
    t.string "philosophy"
    t.string "axis"
    t.string "profile"
    t.string "information"
    t.boolean "status", default: true
    t.bigint "academic_period_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_id", null: false
    t.index ["academic_period_id"], name: "index_courses_on_academic_period_id"
    t.index ["user_id"], name: "index_courses_on_user_id"
  end

  create_table "documents", force: :cascade do |t|
    t.string "location"
    t.string "key"
    t.string "bucket"
    t.boolean "status", default: true
    t.bigint "subject_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["subject_id"], name: "index_documents_on_subject_id"
  end

  create_table "subjects", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.string "information"
    t.boolean "status", default: true
    t.bigint "course_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["course_id"], name: "index_subjects_on_course_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "email"
    t.string "password_digest"
    t.string "type_doc"
    t.string "num_doc"
    t.string "abrev"
    t.string "nickname"
    t.string "lastname1"
    t.string "lastname2"
    t.string "mobile"
    t.string "address"
    t.string "information"
    t.string "degree"
    t.string "biography"
    t.integer "status", default: 4
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  add_foreign_key "courses", "academic_periods"
  add_foreign_key "courses", "users"
  add_foreign_key "documents", "subjects"
  add_foreign_key "subjects", "courses"
end
