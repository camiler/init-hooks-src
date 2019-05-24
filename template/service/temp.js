import ApiEnums from './api';

class {{serviceName}} {
  async getList(data = {}) {
    const res = await fetch(ApiEnums.getList, {
      body: data,
      method: 'POST',
    });
    return res;
  }

  async addItem(data = {}) {
    const res = await fetch(ApiEnums.addItem, {
      body: data,
      method: 'POST',
    });
    return res;
  }

  async updateItem(data = {}) {
    const res = await fetch(ApiEnums.updateItem, {
      body: data,
      method: 'PUT',
    });
    return res;
  }

  async deleteItem(id) {
    const res = await fetch(`${ApiEnums.deleteItem}/${id}`, {
      method: 'DELETE'
    });
    return res;
  }

  async getDetail(id) {
    const res = await fetch(`${ApiEnums.getDetail}/${id}`, {
      method: 'GET'
    });
    return res;
  }
}

export default new {{serviceName}}();