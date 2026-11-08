<?php

namespace App\Exceptions;

use App\Traits\ApiResponse;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppException extends Exception
{
    /**
     * @param  list<array{path: string, message: string}>  $errorMessages
     */
    public function __construct(
        protected int $statusCode = 400,
        string $message = 'An unexpected error occurred',
        protected array $errorMessages = []
    ) {
        parent::__construct($message, $statusCode);

        if (empty($this->errorMessages)) {
            $this->errorMessages = [
                ['path' => '', 'message' => $message],
            ];
        }
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    /**
     * @return list<array{path: string, message: string}>
     */
    public function getErrorMessages(): array
    {
        return $this->errorMessages;
    }

    public function render(Request $request): JsonResponse
    {
        return ApiResponse::formatError($this->getMessage(), $this->statusCode, $this->errorMessages);
    }
}
