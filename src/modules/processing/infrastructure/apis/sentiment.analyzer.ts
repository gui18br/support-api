import axios, { AxiosInstance } from 'axios';
import { SentimentRequestDTO } from './dtos/sentiment-request.dto';
import { SentimentResponseDTO } from './dtos/sentiment-response.dto';

export class SentimentAnalyzer {
  private http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: 'https://sentiment-ms:8001',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async analizarSentimento(
    data: SentimentRequestDTO,
  ): Promise<SentimentResponseDTO> {
    const response = await this.http.post<SentimentResponseDTO>(
      '/sentiment',
      data,
    );

    return response.data;
  }
}
