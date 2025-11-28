import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import assignmentService from "@/services/api/assignmentService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";

const TeacherCreateForm = ({ onAssignmentCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    questionText: "",
    options: { A: "", B: "", C: "", D: "" },
    correctAnswer: "A",
    liveDate: "",
    expireDate: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (optionKey, value) => {
    setFormData(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [optionKey]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.questionText.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.liveDate || !formData.expireDate) {
      toast.error("Please set both live and expire dates");
      return;
    }

    if (new Date(formData.expireDate) <= new Date(formData.liveDate)) {
      toast.error("Expire date must be after live date");
      return;
    }

    const hasEmptyOptions = Object.values(formData.options).some(option => !option.trim());
    if (hasEmptyOptions) {
      toast.error("Please fill in all option fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const assignmentData = {
        ...formData,
        liveDate: new Date(formData.liveDate).toISOString(),
        expireDate: new Date(formData.expireDate).toISOString()
      };
      
      const newAssignment = await assignmentService.create(assignmentData);
      
      toast.success("Assignment created successfully!");
      
      // Reset form
      setFormData({
        title: "",
        questionText: "",
        options: { A: "", B: "", C: "", D: "" },
        correctAnswer: "A",
        liveDate: "",
        expireDate: ""
      });
      
      if (onAssignmentCreated) {
        onAssignmentCreated(newAssignment);
      }
    } catch (error) {
      toast.error("Failed to create assignment. Please try again.");
      console.error("Error creating assignment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
          <ApperIcon name="Plus" className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Create Assignment</h2>
          <p className="text-gray-600 text-sm">Design a new multiple choice assignment</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Assignment Title"
          required
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="Enter assignment title..."
        />

        <FormField
          label="Question Text"
          required
        >
          <textarea
            value={formData.questionText}
            onChange={(e) => handleInputChange("questionText", e.target.value)}
            placeholder="Enter the question text..."
            rows={3}
            className="form-input w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white resize-none"
          />
        </FormField>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Answer Options</h3>
          {["A", "B", "C", "D"].map(optionKey => (
            <FormField
              key={optionKey}
              label={`Option ${optionKey}`}
              required
              value={formData.options[optionKey]}
              onChange={(e) => handleOptionChange(optionKey, e.target.value)}
              placeholder={`Enter option ${optionKey}...`}
            />
          ))}
        </div>

        <FormField
          label="Correct Answer"
          required
        >
          <select
            value={formData.correctAnswer}
            onChange={(e) => handleInputChange("correctAnswer", e.target.value)}
            className="form-input w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
          >
            {["A", "B", "C", "D"].map(option => (
              <option key={option} value={option}>
                Option {option}
              </option>
            ))}
          </select>
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Live Date & Time"
            required
            type="datetime-local"
            value={formData.liveDate}
            onChange={(e) => handleInputChange("liveDate", e.target.value)}
          />

          <FormField
            label="Expire Date & Time"
            required
            type="datetime-local"
            value={formData.expireDate}
            onChange={(e) => handleInputChange("expireDate", e.target.value)}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <ApperIcon name="Loader" className="w-4 h-4 mr-2 animate-spin" />
              Creating Assignment...
            </>
          ) : (
            <>
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Create Assignment
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default TeacherCreateForm;