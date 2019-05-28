import ApiEnums from './api';
import axios from 'axios';

class {{serviceName}} {
  async getList(data = {}) {
    const res = await axios.request(ApiEnums.getList, {
      body: data,
      method: 'POST',
    });
    return res;
  }

  async addItem(data = {}) {
    const res = await axios.request(ApiEnums.addItem, {
      body: data,
      method: 'POST',
    });
    return res;
  }

  async updateItem(data = {}) {
    const res = await axios.request(ApiEnums.updateItem, {
      body: data,
      method: 'PUT',
    });
    return res;
  }

  async deleteItem(id) {
    const res = await axios.request(`${ApiEnums.deleteItem}/${id}`, {
      method: 'DELETE'
    });
    return res;
  }

  async getDetail(id) {
    const res = await axios.request(`${ApiEnums.getDetail}/${id}`, {
      method: 'GET'
    });
    return res;
  }
}

export default new {{serviceName}}();