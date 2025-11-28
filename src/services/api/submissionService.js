import submissionsData from "@/services/mockData/submissions.json";

class SubmissionService {
  constructor() {
    this.submissions = [...submissionsData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.submissions];
  }

  async getByUserId(userId) {
    await this.delay();
    return this.submissions
      .filter(submission => submission.userId === userId)
      .map(submission => ({ ...submission }));
  }

  async getByAssignmentAndUser(assignmentId, userId) {
    await this.delay();
    const submission = this.submissions.find(
      sub => sub.assignmentId === assignmentId.toString() && sub.userId === userId
    );
    return submission ? { ...submission } : null;
  }

  async create(submission) {
    await this.delay();
    const maxId = this.submissions.length > 0 
      ? Math.max(...this.submissions.map(item => item.Id))
      : 0;
    
    const newSubmission = {
      ...submission,
      Id: maxId + 1,
      submissionTime: new Date().toISOString()
    };
    
    this.submissions.push(newSubmission);
    return { ...newSubmission };
  }

  async update(id, updatedData) {
    await this.delay();
    const index = this.submissions.findIndex(item => item.Id === parseInt(id));
    
    if (index !== -1) {
      this.submissions[index] = { 
        ...this.submissions[index], 
        ...updatedData 
      };
      return { ...this.submissions[index] };
    }
    
    return null;
  }

  async delete(id) {
    await this.delay();
    const index = this.submissions.findIndex(item => item.Id === parseInt(id));
    
    if (index !== -1) {
      const deleted = this.submissions.splice(index, 1)[0];
      return { ...deleted };
    }
    
    return null;
  }
}

export default new SubmissionService();