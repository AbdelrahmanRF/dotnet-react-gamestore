using System;
using System.ComponentModel.DataAnnotations;

namespace GameStore.Api.Attributes;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
public class DateRange : ValidationAttribute
{
    private const string DateFormat = "yyyy-MM-dd";
    private readonly DateOnly _minDate;
    private readonly DateOnly _maxDate;

    public DateRange()
    {
        _minDate = new DateOnly(1900, 1, 1);
        _maxDate = DateOnly.FromDateTime(DateTime.Today);
    }

    public DateRange(string minDate, string maxDate)
    {
        _minDate = DateOnly.Parse(minDate);
        _maxDate = DateOnly.Parse(maxDate);
    }

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is null)
            return ValidationResult.Success; // let [Required] handle nulls

        if (value is not DateOnly date)
            return new ValidationResult("Invalid date format.");

        if (date < _minDate || date > _maxDate)
        {
            return new ValidationResult(
                ErrorMessage ??
                $"Date must be between {_minDate.ToString(DateFormat)} and {_maxDate.ToString(DateFormat)}");
        }

        return ValidationResult.Success;
    }
}
