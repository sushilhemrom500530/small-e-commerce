<?php

namespace App\Traits;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     * Send a standardized success API response.
     *
     * @param  array{currentPage?: int, limit?: int, totalResult?: int, totalPages?: int}|null  $meta
     */
    public function sendResponse(
        mixed $results = null,
        string $message = 'Operation completed successfully.',
        int $statusCode = 200,
        ?array $meta = null
    ): JsonResponse {
        return self::formatResponse($results, $message, $statusCode, $meta);
    }

    /**
     * Send a standardized paginated API response.
     *
     * @param  mixed  $items  Optional custom items if transformed
     */
    public function sendPaginatedResponse(
        LengthAwarePaginator|Paginator $paginator,
        string $message = 'Operation completed successfully.',
        int $statusCode = 200,
        mixed $items = null
    ): JsonResponse {
        return self::formatPaginatedResponse($paginator, $message, $statusCode, $items);
    }

    /**
     * Send a standardized error API response.
     *
     * @param  list<array{path: string, message: string}>  $errorMessages
     */
    public function sendError(
        string $message = 'An error occurred.',
        int $statusCode = 400,
        array $errorMessages = []
    ): JsonResponse {
        return self::formatError($message, $statusCode, $errorMessages);
    }

    /**
     * Format a success response with results and optional pagination meta.
     *
     * @param  array{currentPage?: int, limit?: int, totalResult?: int, totalPages?: int}|null  $meta
     */
    public static function formatResponse(
        mixed $results = null,
        string $message = 'Operation completed successfully.',
        int $statusCode = 200,
        ?array $meta = null
    ): JsonResponse {
        if ($results instanceof LengthAwarePaginator || $results instanceof Paginator) {
            return self::formatPaginatedResponse($results, $message, $statusCode);
        }

        $payload = [
            'statusCode' => $statusCode,
            'success' => true,
            'message' => $message,
        ];

        if ($meta !== null) {
            $payload['meta'] = $meta;
        }

        $payload['results'] = $results;

        return new JsonResponse($payload, $statusCode);
    }

    /**
     * Format a paginated response with meta and results.
     */
    public static function formatPaginatedResponse(
        LengthAwarePaginator|Paginator $paginator,
        string $message = 'Operation completed successfully.',
        int $statusCode = 200,
        mixed $items = null
    ): JsonResponse {
        $meta = [
            'currentPage' => $paginator->currentPage(),
            'limit' => $paginator->perPage(),
        ];

        if ($paginator instanceof LengthAwarePaginator) {
            $meta['totalResult'] = $paginator->total();
            $meta['totalPages'] = $paginator->lastPage();
        }

        return new JsonResponse([
            'statusCode' => $statusCode,
            'success' => true,
            'message' => $message,
            'meta' => $meta,
            'results' => $items ?? $paginator->items(),
        ], $statusCode);
    }

    /**
     * Format an error response.
     *
     * @param  list<array{path: string, message: string}>  $errorMessages
     */
    public static function formatError(
        string $message = 'An error occurred.',
        int $statusCode = 400,
        array $errorMessages = []
    ): JsonResponse {
        $payload = [
            'statusCode' => $statusCode,
            'success' => false,
            'message' => $message,
        ];

        if (! empty($errorMessages)) {
            $payload['errorMessages'] = $errorMessages;
        }

        return new JsonResponse($payload, $statusCode);
    }
}
