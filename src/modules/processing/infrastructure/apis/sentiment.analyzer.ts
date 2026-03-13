import axios, { AxiosInstance } from 'axios';
import { SentimentRequestDTO } from './dtos/sentiment-request.dto';
import { SentimentResponseDTO } from './dtos/sentiment-response.dto';
import { Injectable } from '@nestjs/common';
import http from 'http';

@Injectable()
export class SentimentAnalyzer {
  private http: AxiosInstance;

  constructor() {
    const agent = new http.Agent({
      keepAlive: true,
      maxSockets: 100,
    });

    this.http = axios.create({
      baseURL: 'http://sentiment-ms:8001',
      headers: { 'Content-Type': 'application/json' },
      httpAgent: agent,
      timeout: 5000,
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
