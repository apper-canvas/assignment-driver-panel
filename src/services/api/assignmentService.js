import assignmentsData from "@/services/mockData/assignments.json";

class AssignmentService {
  constructor() {
    this.assignments = [...assignmentsData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.assignments];
  }

  async getById(id) {
    await this.delay();
    const assignment = this.assignments.find(item => item.Id === parseInt(id));
    return assignment ? { ...assignment } : null;
  }

  async create(assignment) {
    await this.delay();
    const maxId = this.assignments.length > 0 
      ? Math.max(...this.assignments.map(item => item.Id))
      : 0;
    
    const newAssignment = {
      ...assignment,
      Id: maxId + 1,
      isLive: false
    };
    
    this.assignments.push(newAssignment);
    return { ...newAssignment };
  }

  async update(id, updatedData) {
    await this.delay();
    const index = this.assignments.findIndex(item => item.Id === parseInt(id));
    
    if (index !== -1) {
      this.assignments[index] = { 
        ...this.assignments[index], 
        ...updatedData 
      };
      return { ...this.assignments[index] };
    }
    
    return null;
  }

  async delete(id) {
    await this.delay();
    const index = this.assignments.findIndex(item => item.Id === parseInt(id));
    
    if (index !== -1) {
      const deleted = this.assignments.splice(index, 1)[0];
      return { ...deleted };
    }
    
    return null;
  }

  async toggleLiveStatus(id) {
    await this.delay();
    const index = this.assignments.findIndex(item => item.Id === parseInt(id));
    
    if (index !== -1) {
      this.assignments[index].isLive = !this.assignments[index].isLive;
      return { ...this.assignments[index] };
    }
    
    return null;
  }

async getLiveAssignments() {
    await this.delay();
    const now = new Date().toISOString();
    
    return this.assignments.filter(assignment => 
      assignment.isLive && 
      assignment.liveDate <= now && 
      assignment.expireDate > now
    ).map(assignment => ({ ...assignment }));
  }

  async getFilteredAssignments(filters = {}) {
    await this.delay();
    const now = new Date().toISOString();
    
    return this.assignments.filter(assignment => {
      // Date range filtering
      if (filters.startDate) {
        const startDate = new Date(filters.startDate).toISOString();
        if (assignment.liveDate < startDate) return false;
      }
      
      if (filters.endDate) {
        const endDate = new Date(filters.endDate).toISOString();
        if (assignment.expireDate > endDate) return false;
      }
      
      // Status filtering
      const isExpired = assignment.expireDate <= now;
      const isLive = assignment.isLive && assignment.liveDate <= now && assignment.expireDate > now;
      
      if (!filters.showLive && isLive) return false;
      if (!filters.showExpired && isExpired) return false;
      if (filters.showLive && !isLive && !isExpired) return false;
      
      return true;
    }).map(assignment => ({ ...assignment }));
  }

  async getAssignmentSummary() {
    await this.delay();
    const now = new Date().toISOString();
    
    const total = this.assignments.length;
    const live = this.assignments.filter(assignment => 
      assignment.isLive && 
      assignment.liveDate <= now && 
      assignment.expireDate > now
    ).length;
    const expired = this.assignments.filter(assignment => 
      assignment.expireDate <= now
    ).length;

    return { total, live, expired };
  }
}

export default new AssignmentService();