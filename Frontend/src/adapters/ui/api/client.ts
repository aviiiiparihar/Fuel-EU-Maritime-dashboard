import axios, { type AxiosInstance, AxiosError } from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  async getRoutes(year?: number) {
    try {
      const response = await this.client.get("/api/routes", {
        params: { year },
      })
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async getRoute(id: string) {
    try {
      const response = await this.client.get(`/api/routes/${id}`)
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async getCompliance(year?: number) {
    try {
      const response = await this.client.get("/api/compliance", {
        params: { year },
      })
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async getBanking() {
    try {
      const response = await this.client.get("/api/banking")
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async getPooling() {
    try {
      const response = await this.client.get("/api/pooling")
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  private handleError(error: any) {
    if (error instanceof AxiosError) {
      console.error("API Error:", {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      })
    } else {
      console.error("Unexpected error:", error)
    }
  }
}

export const apiClient = new ApiClient()
