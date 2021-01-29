import { Model } from '@eloqjs/core'

import { assert } from '../support/Utils'
import { QueryParam } from './QueryParam'
import {
  AppendSpec,
  FieldSpec,
  FilterSpec,
  IncludeSpec,
  LimitSpec,
  OptionSpec,
  PageSpec,
  SortSpec
} from './specs'

export class Query {
  public static parameters: {
    append?: string
    field?: string
    filter?: string
    include?: string
    sort?: string
    page?: string
    limit?: string
  } = {}

  protected append: AppendSpec[]

  protected fields: FieldSpec[]

  protected filters: FilterSpec[]

  protected include: IncludeSpec[]

  protected sort: SortSpec[]

  protected options: OptionSpec[]

  protected page?: PageSpec

  protected limit?: LimitSpec

  protected idToFind?: string | number

  private resource: string

  private readonly relatedResource?: string

  private readonly baseId?: string | number

  public constructor(
    resource: string,
    relatedResource?: string,
    modelId?: string | number
  ) {
    this.resource = resource
    this.relatedResource = relatedResource
    this.baseId = modelId

    this.append = []
    this.fields = []
    this.filters = []
    this.include = []
    this.options = []
    this.sort = []

    if (Query.parameters.append) {
      AppendSpec.parameter = Query.parameters.append
    }

    if (Query.parameters.field) {
      FieldSpec.parameter = Query.parameters.field
    }

    if (Query.parameters.filter) {
      FilterSpec.parameter = Query.parameters.filter
    }

    if (Query.parameters.include) {
      IncludeSpec.parameter = Query.parameters.include
    }

    if (Query.parameters.sort) {
      SortSpec.parameter = Query.parameters.sort
    }

    if (Query.parameters.page) {
      PageSpec.parameter = Query.parameters.page
    }

    if (Query.parameters.limit) {
      LimitSpec.parameter = Query.parameters.limit
    }
  }

  /**
   * Groups the values of specs by parameter.
   */
  private static groupByParameter(
    specs: (FieldSpec | FilterSpec | OptionSpec)[]
  ): Map<string, string> {
    const dictionary = new Map()

    for (const spec of specs) {
      const parameter = spec.getParameter()
      let value = spec.getValue()

      if (dictionary.has(parameter)) {
        value = dictionary.get(parameter) + ',' + value
      }

      dictionary.set(parameter, value)
    }

    return dictionary
  }

  private static mapValues(
    specs: (AppendSpec | IncludeSpec | SortSpec)[]
  ): string {
    return specs.map((spec) => spec.getValue()).join(',')
  }

  public addAppend(append: AppendSpec): void {
    this.append.push(append)
  }

  public getAppend(): AppendSpec[] {
    return this.append
  }

  public addInclude(include: IncludeSpec): void {
    this.include.push(include)
  }

  public getInclude(): IncludeSpec[] {
    return this.include
  }

  public addField(field: FieldSpec): void {
    this.fields.push(field)
  }

  public getFields(): FieldSpec[] {
    return this.fields
  }

  public addFilter(filter: FilterSpec): void {
    this.filters.push(filter)
  }

  public getFilters(): FilterSpec[] {
    return this.filters
  }

  public addSort(sort: SortSpec): void {
    this.sort.push(sort)
  }

  public getSort(): SortSpec[] {
    return this.sort
  }

  public addOption(option: OptionSpec): void {
    this.options.push(option)
  }

  public getOptions(): OptionSpec[] {
    return this.options
  }

  public setPage(page: PageSpec): void {
    this.page = page
  }

  public getPage(): PageSpec | undefined {
    return this.page
  }

  public setLimit(limit: LimitSpec): void {
    this.limit = limit
  }

  public getLimit(): LimitSpec | undefined {
    return this.limit
  }

  public setIdToFind(idToFind: string | number): void {
    this.idToFind = idToFind
  }

  public setResource(resources: (string | Model)[]): void {
    // It would be unintuitive for users to manage where the '/' has to be for
    // multiple arguments. We don't need it for the first argument if it's
    // a string, but subsequent string arguments need the '/' at the beginning.
    // We handle this implementation detail here to simplify the readme.
    let slash = ''
    let resource = ''

    resources.forEach((value) => {
      switch (true) {
        case typeof value === 'string':
          resource += slash + (value as string).replace(/^\/+/, '')
          break
        case value instanceof Model: {
          const model = value as Model
          const id = model.$id
          resource += slash + model.$resource

          if (id !== null) {
            resource += '/' + id
          }
          break
        }
        default:
          assert(false, [
            'Arguments of custom() must be either strings or instances of Model.'
          ])
      }

      if (!slash.length) {
        slash = '/'
      }
    })

    this.resource = resource
  }

  public toString(): string {
    let relationToFind: string

    if (!this.baseId) {
      relationToFind = this.relatedResource ? '/' + this.relatedResource : ''
    } else {
      relationToFind = this.relatedResource
        ? '/' + this.baseId + '/' + this.relatedResource
        : ''
    }

    const idToFind = this.idToFind ? '/' + this.idToFind : ''
    const paramString = this.stringifyParameters()

    return this.resource + relationToFind + idToFind + paramString
  }

  protected addIncludeParameters(searchParams: QueryParam[]): void {
    if (this.include.length > 0) {
      const parameter = IncludeSpec.parameter
      const value = Query.mapValues(this.include)

      searchParams.push(new QueryParam(parameter, value))
    }
  }

  protected addAppendParameters(searchParams: QueryParam[]): void {
    if (this.append.length > 0) {
      const parameter = AppendSpec.parameter
      const value = Query.mapValues(this.append)

      searchParams.push(new QueryParam(parameter, value))
    }
  }

  protected addFieldParameters(searchParams: QueryParam[]): void {
    const fields = Query.groupByParameter(this.fields)

    for (const [parameter, value] of fields) {
      searchParams.push(new QueryParam(parameter, value))
    }
  }

  protected addFilterParameters(searchParams: QueryParam[]): void {
    const filters = Query.groupByParameter(this.filters)

    for (const [parameter, value] of filters) {
      searchParams.push(new QueryParam(parameter, value))
    }
  }

  protected addSortParameters(searchParams: QueryParam[]): void {
    if (this.sort.length > 0) {
      const parameter = SortSpec.parameter
      const value = Query.mapValues(this.sort)

      searchParams.push(new QueryParam(parameter, value))
    }
  }

  protected addOptionsParameters(searchParams: QueryParam[]): void {
    const options = Query.groupByParameter(this.options)

    for (const [parameter, value] of options) {
      searchParams.push(new QueryParam(parameter, value))
    }
  }

  protected addPaginationParameters(searchParams: QueryParam[]): void {
    if (this.page) {
      searchParams.push(
        new QueryParam(PageSpec.parameter, this.page.getValue())
      )
    }

    if (this.limit) {
      searchParams.push(
        new QueryParam(LimitSpec.parameter, this.limit.getValue())
      )
    }
  }

  private stringifyParameters(): string {
    const searchParams: QueryParam[] = []

    this.addIncludeParameters(searchParams)
    this.addAppendParameters(searchParams)
    this.addFieldParameters(searchParams)
    this.addFilterParameters(searchParams)
    this.addSortParameters(searchParams)
    this.addPaginationParameters(searchParams)
    this.addOptionsParameters(searchParams)

    const encodedParams = searchParams
      .map((searchParam) => searchParam.encode())
      .join('&')

    return encodedParams ? '?' + encodedParams : ''
  }
}
