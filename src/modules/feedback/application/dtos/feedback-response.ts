export interface FeedbackResponseDTO {
  feedback: {
    uuid: string;
    ticketUuid: string;
    content: string;
  };
}
