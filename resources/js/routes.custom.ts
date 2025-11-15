// resources/js/routes.custom.ts
import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './wayfinder'

/**
 * Teacher-facing answer key
 * GET /tests/games/answer-key
 */
export const testsGamesAnswerKey = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: testsGamesAnswerKey.url(options),
    method: 'get',
})

testsGamesAnswerKey.definition = {
    methods: ['get','head'],
    url: '/games/answer-key',
} satisfies RouteDefinition<['get','head']>

testsGamesAnswerKey.url = (options?: RouteQueryOptions) =>
    testsGamesAnswerKey.definition.url + queryParams(options)

testsGamesAnswerKey.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: testsGamesAnswerKey.url(options),
    method: 'get',
})

testsGamesAnswerKey.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: testsGamesAnswerKey.url(options),
    method: 'head',
})

const testsGamesAnswerKeyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: testsGamesAnswerKey.url(options),
    method: 'get',
})
testsGamesAnswerKey.form = testsGamesAnswerKeyForm


/**
 * Teacher-facing code checklist
 * GET /tests/code/teacher
 */
export const testsCodeTeacher = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: testsCodeTeacher.url(options),
    method: 'get',
})

testsCodeTeacher.definition = {
    methods: ['get','head'],
    url: '/tests/code/teacher',
} satisfies RouteDefinition<['get','head']>

testsCodeTeacher.url = (options?: RouteQueryOptions) =>
    testsCodeTeacher.definition.url + queryParams(options)

testsCodeTeacher.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: testsCodeTeacher.url(options),
    method: 'get',
})

testsCodeTeacher.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: testsCodeTeacher.url(options),
    method: 'head',
})

const testsCodeTeacherForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: testsCodeTeacher.url(options),
    method: 'get',
})
testsCodeTeacher.form = testsCodeTeacherForm
