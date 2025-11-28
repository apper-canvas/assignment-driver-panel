import { useState } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import CountdownTimer from "@/components/molecules/CountdownTimer";
import submissionService from "@/services/api/submissionService";
import assignmentService from "@/services/api/assignmentService";

const AssignmentModal = ({ assignment, userId, onClose, onSubmitted }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedOption) {
      toast.error("Please select an answer before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the assignment details to compare answer
      const assignmentDetails = await assignmentService.getById(assignment.Id);
      
      if (!assignmentDetails) {
        throw new Error("Assignment not found");
      }

      const isCorrect = selectedOption === assignmentDetails.correctAnswer;
      const score = isCorrect ? 1 : 0;

      const submissionData = {
        assignmentId: assignment.Id.toString(),
        submittedAnswers: {
          [assignment.Id.toString()]: selectedOption
        },
        score: score,
        total: 1,
        userId: userId
      };

      await submissionService.create(submissionData);

      // Show feedback with a flash effect
      const message = isCorrect 
        ? `Correct! You earned 1/1 points.`
        : `Incorrect. The correct answer was Option ${assignmentDetails.correctAnswer}. You earned 0/1 points.`;
      
      if (isCorrect) {
        toast.success(message);
      } else {
        toast.error(message);
      }

      // Close modal after brief delay
      setTimeout(() => {
        onClose();
        if (onSubmitted) {
          onSubmitted();
        }
      }, 1000);

    } catch (error) {
      toast.error("Failed to submit assignment. Please try again.");
      console.error("Error submitting assignment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExpire = () => {
    toast.warning("Time's up! Assignment has expired.");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {assignment.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ApperIcon name="Clock" className="w-4 h-4" />
                <span>Time remaining:</span>
                <CountdownTimer 
                  expireDate={assignment.expireDate}
                  onExpire={handleExpire}
                  className="font-bold text-amber-600"
                />
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <h3 className="font-semibold text-gray-900 mb-2">Question:</h3>
              <p className="text-gray-700 leading-relaxed">
                {assignment.questionText}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Select your answer:</h3>
              
              <div className="space-y-2">
                {Object.entries(assignment.options).map(([optionKey, optionText]) => (
                  <label
                    key={optionKey}
                    className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedOption === optionKey
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={optionKey}
                      checked={selectedOption === optionKey}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-blue-600">Option {optionKey}:</span>
                        <span className="text-gray-700">{optionText}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              
              <Button
                onClick={handleSubmit}
                disabled={!selectedOption || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <ApperIcon name="Loader" className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                    Submit Answer
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AssignmentModal;